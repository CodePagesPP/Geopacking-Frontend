import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Asegúrate de importar las interfaces correctas que definimos arriba
import {
  Products,
  ProductoEX,
  ProductoTF,
  ProductoDTO,
} from '../../core/models/products.model';
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
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  currentProductType: 'EX' | 'TF' = 'EX'; // Tipado explícito ayuda
  productsList: (ProductoEX | ProductoTF)[] = [];

  public materials$: Observable<Material[]>;
  public colors$: Observable<Color[]>;
  public unidadesDeMedida: string[] = ['UND', 'KG', 'MTR', 'LTO'];

  // Observable para la lista de insumos cuando estamos en TF
  public exProductsForMaterial$: Observable<ProductoEX[]>;

  mostrarModal: boolean = false;
  isEditMode: boolean = false;
  modalProduct: ProductoDTO = this.getNewProductDTO();
  originalCode: string = '';

  constructor(
    private productsService: ProductsService,
    private toolService: ToolService
  ) {
    this.materials$ = of([]);
    this.colors$ = of([]);
    this.exProductsForMaterial$ = of([]);
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadDropdowns();
    this.loadExProductsForDropdown();
  }

  loadDropdowns(): void {
    this.materials$ = this.toolService.getAll('Material').pipe(
      catchError((err) => {
        console.error('Error cargando Materiales', err);
        return of([]);
      })
    );
    this.colors$ = this.toolService.getAll('Color').pipe(
      catchError((err) => {
        console.error('Error cargando Colores', err);
        return of([]);
      })
    );
  }

  loadExProductsForDropdown(): void {
    // Cargamos Productos EX para usarlos como materia prima de TF
    this.exProductsForMaterial$ = this.productsService.getAll('EX').pipe(
      catchError((err) => {
        console.error('Error cargando Productos EX', err);
        return of([]);
      })
    );
  }

  loadProducts(): void {
    this.productsService.getAll(this.currentProductType).subscribe({
      next: (data) => {
        this.productsList = data;
      },
      error: (err) => {
        console.error(
          `Error cargando productos ${this.currentProductType}`,
          err
        );
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      },
    });
  }

  switchType(type: 'EX' | 'TF'): void {
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
      colorId: null,
    };
  }

  // --- AQUÍ ESTÁ LA LÓGICA CORREGIDA ---
  openModal(product?: ProductoEX | ProductoTF): void {
    if (product) {
      this.isEditMode = true;
      this.originalCode = product.code;

      // Determinamos cuál es el ID del "Material" dependiendo del tipo
      let currentMaterialId: number | null = null;

      if (this.currentProductType === 'EX') {
        // Si es EX, el backend manda objeto 'material'
        currentMaterialId = (product as ProductoEX).material?.id || null;
      } else {
        // Si es TF, el backend manda objeto 'productoBase'
        currentMaterialId = (product as ProductoTF).productoBase?.id || null;
      }

      this.modalProduct = {
        name: product.name,
        code: product.code,
        referencia: product.referencia,
        marca: product.marca,
        linea: product.linea,
        categoria: product.categoria,
        unidadDeMedida: product.unidadDeMedida,
        pesoUnitario: product.pesoUnitario,
        activo: product.activo,
        colorId: product.color?.id || null,

        // Aquí asignamos el ID que calculamos arriba
        materialId: currentMaterialId,
      };
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

  saveProduct(): void {
    Swal.fire({
      title: 'Guardando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const operation = this.isEditMode
      ? this.productsService.update(
          this.originalCode,
          this.modalProduct,
          this.currentProductType
        )
      : this.productsService.create(this.modalProduct, this.currentProductType);

    operation.subscribe({
      next: () => {
        this.closeModal();
        this.loadProducts();
        // Si creamos un EX nuevo, recargamos la lista de dropdown para que aparezca en TF
        if (this.currentProductType === 'EX') {
          this.loadExProductsForDropdown();
        }
        Swal.fire(
          '¡Guardado!',
          `El producto se ${
            this.isEditMode ? 'actualizó' : 'creó'
          } correctamente.`,
          'success'
        );
      },
      error: (err) => {
        console.error('Error al guardar producto', err);
        Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
      },
    });
  }

  confirmDelete(code: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(code);
      }
    });
  }

  private deleteProduct(code: string): void {
    this.productsService.delete(code, this.currentProductType).subscribe({
      next: () => {
        this.loadProducts();
        if (this.currentProductType === 'EX') this.loadExProductsForDropdown();
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      },
      error: (err) => Swal.fire('Error', 'No se pudo eliminar.', 'error'),
    });
  }
}
