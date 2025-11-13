import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente, ClienteDTO } from '../../core/models/cliente.model';
import { ClienteService } from '../../core/services/clients.service';
import Swal from 'sweetalert2';
import { Page } from '../../core/models/page.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientesComponent implements OnInit {

  clientesList: Cliente[] = []; 
  
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;

  filtroNombre: string = '';
  
  
  private filterTimeout: any = null;

  mostrarModal: boolean = false;
  isEditMode: boolean = false;
  
  currentCliente: ClienteDTO = this.createEmptyDto();
  editClienteId: number | null = null; 
  tiposCliente = ['Interno', 'Distribuidor', 'Mayorista', 'Minorista'];
  tiposDocumento = ['RUC', 'DNI', 'CE', 'Pasaporte', 'Doc.trib.no.dom.sin.ruc'];
  paises = ['PERU', 'BOLIVIA', 'CHILE', 'ECUADOR', 'COLOMBIA', 'OTRO'];
  departamentos: string[] = [];
  disableDepartamentos: boolean = true;
  isExporting: boolean = false;
  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientesPaginados(this.filtroNombre, this.currentPage, this.pageSize)
      .subscribe({
        next: (page: Page<Cliente>) => {
          this.clientesList = page.content; 
          this.totalPages = page.totalPages;
          this.totalElements = page.totalElements;
          this.currentPage = page.number; 
        },
        error: (err) => Swal.fire('Error', 'No se pudieron cargar los clientes', 'error')
    });
  }


  exportarExcel(): void {
    this.isExporting = true; // Bloquea el botón

    this.clienteService.exportClientes(this.filtroNombre).subscribe({
      next: (response: HttpResponse<Blob>) => {
       
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'Reporte_Clientes.xlsx'; 
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
          }
        }

     
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          
        
          document.body.appendChild(a);
          a.click();
          
        
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
        
        this.isExporting = false;
      },
      error: (err) => {
        this.isExporting = false;
        console.error('Error al exportar Excel:', err);
        Swal.fire('Error', 'No se pudo generar el archivo Excel.', 'error');
      }
    });
  }

 
  onFilterChange(): void {
   
    clearTimeout(this.filterTimeout);

   
    this.filterTimeout = setTimeout(() => {
     
      this.filtrarClientes();
    }, 300); 
  }

 
  filtrarClientes(): void {
    this.currentPage = 0; 
    this.loadClientes();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 0 || pagina >= this.totalPages) {
      return; 
    }
    this.currentPage = pagina;
    this.loadClientes();
  }


  createEmptyDto(): ClienteDTO {
    return {
      tipoCliente: '',
      tipoDocumento: 'RUC',
      numeroDocumento: '',
      nombre: '',
      nombreComercial: '',
      pais: 'PERU',
      departamento: '',
      provincia: '',
      distrito: '',
      direccion: '',
      telefono: '',
      email: '',
      fechaNacimiento: undefined,
      creditoHabilitado: false,
      montoCredito: 0,
      observacion: '',
      contactoNombre: '',
      contactoTelefono: ''
    };
  }

  openModal(cliente?: Cliente): void {
    if (cliente) {
      this.isEditMode = true;
      this.editClienteId = cliente.id;
      this.currentCliente = { ...cliente };
      
      if(this.currentCliente.pais === 'PERU') {
        this.onPaisChange(false); 
      }

    } else {
      this.isEditMode = false;
      this.editClienteId = null;
      this.currentCliente = this.createEmptyDto();
      this.onPaisChange(false);
    }
    this.mostrarModal = true;
  }

  closeModal(): void {
    this.mostrarModal = false;
  }

  saveCliente(): void {
    if (!this.currentCliente.nombre || !this.currentCliente.numeroDocumento || !this.currentCliente.tipoDocumento) {
      Swal.fire('Campos incompletos', 'Tipo Doc, Número y Nombre son obligatorios.', 'warning');
      return;
    }

    Swal.fire({ title: 'Guardando...', text: 'Por favor espera', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const operation = this.isEditMode
      ? this.clienteService.updateCliente(this.editClienteId!, this.currentCliente)
      : this.clienteService.createCliente(this.currentCliente);

    operation.subscribe({
      next: () => {
        this.closeModal();
        this.loadClientes(); 
        Swal.fire('¡Guardado!', `El cliente se ${this.isEditMode ? 'actualizó' : 'creó'} correctamente.`, 'success');
      },
      error: (err) => {
        console.error('Error al guardar cliente', err);
        const errorMsg = err.error?.message || 'Verifique si el número de documento ya existe.';
        Swal.fire('Error', `No se pudo guardar. ${errorMsg}`, 'error');
      }
    });
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el cliente. Esta acción no se puede revertir.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCliente(id);
      }
    });
  }

  private deleteCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.loadClientes(); 
        Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
      },
      error: (err) => Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error')
    });
  }

  onPaisChange(resetFields: boolean = true): void {
    if (this.currentCliente.pais === 'PERU') {
      this.disableDepartamentos = false;
      if (resetFields) {
        this.currentCliente.departamento = '';
        this.currentCliente.provincia = ''; 
        this.currentCliente.distrito = '';  
      }
      this.clienteService.getDepartamentos().subscribe(data => this.departamentos = data);
    } else {
      this.disableDepartamentos = true;
      this.currentCliente.departamento = '';
      this.currentCliente.provincia = '';
      this.currentCliente.distrito = '';
    }
  }

  verificarDocumento() {
    if (!this.currentCliente.numeroDocumento || this.currentCliente.numeroDocumento.length < 8) {
      Swal.fire('Dato inválido', 'Por favor, ingrese un número de documento válido.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Verificando...',
      text: `Buscando documento ${this.currentCliente.numeroDocumento} en el sistema.`,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.clienteService.getClienteByNumero(this.currentCliente.numeroDocumento).subscribe({
      next: (clienteEncontrado) => {
        Swal.fire({
          icon: 'error',
          title: 'Documento ya registrado',
          text: `El documento ${clienteEncontrado.numeroDocumento} ya pertenece a "${clienteEncontrado.nombre}".`,
          confirmButtonColor: '#ef4444'
        });
      },
      error: (err) => {
        if (err.status === 404) {
          Swal.fire({
            icon: 'success',
            title: 'Documento disponible',
            text: 'El número de documento está libre para ser registrado.',
            confirmButtonColor: '#10b981'
          });
        } else {
          Swal.fire('Error', 'No se pudo completar la verificación.', 'error');
        }
      }
    });
  }

}