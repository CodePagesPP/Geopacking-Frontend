import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Products, Product, ProductCreateDTO, ProductoEX, ProductoTF } from '../../core/models/products.model';
import { ProductsService } from '../../core/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  // Estado de la UI
  currentProductType: Products = 'EX'; // Inicia en la pestaña 'EX'
  productsList: (ProductoEX | ProductoTF)[] = [];

  // Modal
  mostrarModal: boolean = false;
  isEditMode: boolean = false;
  modalProduct: ProductCreateDTO = { code: '', name: '' };
  originalCode: string = ''; // Para guardar el código original al editar

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.loadProducts();
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

  // Abre el modal (para crear o editar)
  openModal(product?: Product): void {
    if (product) {
      // Modo Edición
      this.isEditMode = true;
      this.modalProduct = { code: product.code, name: product.name };
      this.originalCode = product.code;
    } else {
      // Modo Creación
      this.isEditMode = false;
      this.modalProduct = { code: '', name: '' };
      this.originalCode = '';
    }
    this.mostrarModal = true;
  }

  closeModal(): void {
    this.mostrarModal = false;
  }

  // Guarda (Crea o Actualiza) un producto
  saveProduct(): void {
    if (!this.modalProduct.code || !this.modalProduct.name) {
      Swal.fire('Campos incompletos', 'El código y el nombre son obligatorios.', 'warning');
      return;
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
        this.loadProducts(); // Recarga la lista
        Swal.fire('¡Guardado!', `El producto se ${this.isEditMode ? 'actualizó' : 'creó'} correctamente.`, 'success');
      },
      error: (err) => {
        console.error('Error al guardar producto', err);
        Swal.fire('Error', 'No se pudo guardar el producto. Verifique si el código ya existe.', 'error');
      }
    });
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

  // Elimina el producto
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