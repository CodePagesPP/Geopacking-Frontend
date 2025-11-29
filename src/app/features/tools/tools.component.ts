import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tool, ToolCreateDTO, Tools } from '../../core/models/tool.model';
import { ToolService } from '../../core/services/tool.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.css'
})

export class ToolsComponent implements OnInit {

  allTools: Tool[] = [];
  selectedToolType: Tools = 'Material';
  toolForm!: FormGroup;
  showForm = false;
  editingToolCode: number | null = null;
  errorMsg: string | null = null;

  constructor(
    private toolService: ToolService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.toolForm = this.fb.group({
      code: ['', Validators.required],
      name: ['', Validators.required]
    });

    this.loadTools();
  }

  selectTab(toolType: Tools): void {
    this.selectedToolType = toolType;
    this.closeForm();
    this.loadTools();
  }

  loadTools(): void {
    this.toolService.getAll(this.selectedToolType).subscribe(data => {
      this.allTools = data;
    });
  }

  openCreateForm(): void {
    this.editingToolCode = null;
    this.toolForm.reset();
    this.showForm = true;
  }

  openEditForm(tool: Tool): void {
    this.editingToolCode = tool.id;
    this.toolForm.setValue({
      code: tool.code,
      name: tool.name
    });
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingToolCode = null;
    this.toolForm.reset();
  }

  saveTool(): void {
    if (this.toolForm.invalid) {
      this.toolForm.markAllAsTouched(); // Marca campos como inválidos si lo están
      return;
    }

    const toolData: ToolCreateDTO = this.toolForm.value;

    if (this.editingToolCode) {
      this.toolService.update(this.editingToolCode, toolData, this.selectedToolType)
        .subscribe(() => {
          this.loadTools();
          this.closeForm();
        });

    } else {
      this.toolService.create(toolData, this.selectedToolType)
        .subscribe(() => {
          this.loadTools();
          this.closeForm();
        });
    }
  }

  deleteTool(tool: Tool): void {
    this.confirmationService.confirm({
      title: 'Confirmar Eliminación',
      message: `¿Está seguro de que desea eliminar la máquina "${tool.code} - ${tool.name}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).pipe(

      filter(confirmed => confirmed === true)
    ).subscribe({
      next: () => {

        this.toolService.delete(tool.id, this.selectedToolType).subscribe({
          next: () => this.loadTools(),
          error: (err) => this.errorMsg = 'Error al eliminar: ' + (err.message || err.error?.message)
        });
      }
    });
  }
}
