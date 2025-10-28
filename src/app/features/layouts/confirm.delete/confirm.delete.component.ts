import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.delete.component.html',
  styleUrl: './confirm.delete.component.css'
})
export class ConfirmDeleteComponent implements OnInit, OnDestroy {
public isOpen = false;
  public title = 'Confirmar';
  public message = '¿Está seguro?';
  public confirmText = 'Confirmar';
  public cancelText = 'Cancelar';
  
  private stateSubscription: Subscription | undefined;

  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    
    this.stateSubscription = this.confirmationService.modalState$.subscribe(
      (state) => {
        this.isOpen = state.isOpen;
        if (state.isOpen) {
          this.title = state.title;
          this.message = state.message;
          this.confirmText = state.confirmText || 'Confirmar';
          this.cancelText = state.cancelText || 'Cancelar';
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }
  public onConfirm(): void {
    this.confirmationService.onConfirm();
  }

  public onCancel(): void {
    this.confirmationService.onCancel();
  }
}
