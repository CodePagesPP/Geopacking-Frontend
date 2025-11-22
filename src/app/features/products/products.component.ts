import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Products, Product, ProductoEX, ProductoTF, ProductoDTO } from '../../core/models/products.model';
import { ProductsService } from '../../core/services/products.service';
import Swal from 'sweetalert2';
import { Color, Material } from '../../core/models/tool.model';
import { catchError, Observable, of } from 'rxjs';
import { ToolService } from '../../core/services/tool.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  currentProductType: Products = 'EX'; 
  productsList: (ProductoEX | ProductoTF)[] = [];
  public materials$: Observable<Material[]>;
  public colors$: Observable<Color[]>;
  public unidadesDeMedida: string[] = ['UND', 'KG', 'MTR', 'LTO'];

  mostrarModal: boolean = false;
  isEditMode: boolean = false;
  modalProduct: ProductoDTO = this.getNewProductDTO();
  originalCode: string = '';

  constructor(private productsService: ProductsService, private toolService: ToolService) {
    this.materials$ = of([]);
    this.colors$ = of([]);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadDropdowns();
  }


  loadDropdowns(): void {
    this.materials$ = this.toolService.getAll('Material').pipe(
      catchError(err => {
        console.error('Error cargando Materiales', err);
        Swal.fire('Error', 'No se pudieron cargar los materiales', 'error');
        return of([]);
      })
    );
    this.colors$ = this.toolService.getAll('Color').pipe(
      catchError(err => {
        console.error('Error cargando Colores', err);
        Swal.fire('Error', 'No se pudieron cargar los colores', 'error');
        return of([]);
      })
    );
  }

  // Carga los productos según la pestaña activa
  loadProducts(): void {
    this.productsService.getAll(this.currentProductType).subscribe({
      next: (data) => {
        this.productsList = data;
      },
      error: (err) => {
        console.error(`Error cargando productos ${this.currentProductType}`, err);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  // Cambia la pestaña y recarga los datos
  switchType(type: Products): void {
    this.currentProductType = type;
    this.loadProducts();
  }

  private getNewProductDTO(): ProductoDTO {
    return {
      name: '',
      code: '',
      referencia: '',
      marca: '',
      linea: '',
      categoria: '',
      unidadDeMedida: 'UND', 
      pesoUnitario: null,
      activo: true, 
      materialId: null,
      materialesIds: [],
      colorId: null
    };
  }

 
  openModal(product?: Product): void {
    if (product) {
   
      this.isEditMode = true;

      let matId = null;
      let matIds: number[] = [];

      if (this.currentProductType === 'TF') {
         // Si es TF, tomamos el material simple
         matId = product.material?.id || null;
      } else {
         // Si es EX, mapeamos el array de objetos a array de IDs
         // Verificamos que product.materiales exista para evitar errores
         matIds = product.materiales ? product.materiales.map(m => m.id) : [];
      }

      this.modalProduct = {
        id: product.id,
        name: product.name,
        code: product.code,
        referencia: product.referencia,
        marca: product.marca,
        linea: product.linea,
        categoria: product.categoria,
        unidadDeMedida: product.unidadDeMedida,
        pesoUnitario: product.pesoUnitario || null,
        activo: product.activo,
        materialId: matId,        // Asignamos si es TF
        materialesIds: matIds, 
        colorId: product.color?.id || null      
      };
      this.originalCode = product.code;
    } else {
      
      this.isEditMode = false;
      this.modalProduct = this.getNewProductDTO(); 
      this.originalCode = '';
    }
    this.mostrarModal = true;
  }

  closeModal(): void {
    this.mostrarModal = false;
  }

  // Guarda (Crea o Actualiza) un producto
  saveProduct(): void {

    if (this.currentProductType === 'EX') {
      this.modalProduct.pesoUnitario = null;
      this.modalProduct.materialId = null; // EX no usa el ID simple
    } else {
      this.modalProduct.materialesIds = []; // TF no usa la lista
    }
   
    Swal.fire({
      title: 'Guardando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const operation = this.isEditMode
      ? this.productsService.update(this.originalCode, this.modalProduct, this.currentProductType)
      : this.productsService.create(this.modalProduct, this.currentProductType);

    operation.subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts(); 
        Swal.fire('¡Guardado!', `El producto se ${this.isEditMode ? 'actualizó' : 'creó'} correctamente.`, 'success');
      },
      error: (err) => {
        console.error('Error al guardar producto', err);
        Swal.fire('Error', 'No se pudo guardar el producto. Verifique si el código ya existe.', 'error');
      }
    });
  }


  isMaterialSelected(id: number): boolean {
    return this.modalProduct.materialesIds?.includes(id) || false;
  }

  // Agrega o quita el ID del array cuando se hace click
  toggleMaterial(id: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    // Aseguramos que el array esté inicializado
    if (!this.modalProduct.materialesIds) {
      this.modalProduct.materialesIds = [];
    }

    if (isChecked) {
      // Si se marca, lo agregamos
      this.modalProduct.materialesIds.push(id);
    } else {
      // Si se desmarca, lo filtramos (quitamos)
      this.modalProduct.materialesIds = this.modalProduct.materialesIds.filter(item => item !== id);
    }
  }
  // Pregunta antes de eliminar
  confirmDelete(code: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto con código "${code}". Esta acción no se puede revertir.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(code);
      }
    });
  }

 
  private deleteProduct(code: string): void {
    this.productsService.delete(code, this.currentProductType).subscribe({
      next: () => {
        this.loadProducts(); // Recarga la lista
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      },
      error: (err) => {
        console.error('Error al eliminar producto', err);
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    });
  }
}