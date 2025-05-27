import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client } from '../../models/client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css'],
})
export class ClientCreateComponent implements OnInit {
  client: Client = {
    name: '',
    address: '',
    idCardNumber: '',
    phone: '',
    email: '',
  };
  isEditMode: boolean = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const clientId = this.activatedRoute.snapshot.paramMap.get('id');
    if (clientId) {
      this.isEditMode = true;
      this.loadClientData(Number(clientId));  // Ensure the id is passed as a number
    } else {
      console.error('Invalid client ID');
    }
  }

  loadClientData(id: number): void {
    this.clientService.getClientById(id).subscribe(
      (data) => {
        this.client = data;
      },
      (error) => {
        console.error('Error loading client data', error);
      }
    );
  }

  saveClient(): void {
    if (this.isEditMode) {
      // For editing an existing client
      if (this.client.id) {
        this.clientService.updateClient(this.client.id, this.client).subscribe(
          (data) => {
            this.router.navigate(['/clients']);
          },
          (error) => {
            console.error('Error updating client', error);
          }
        );
      }
    } else {
      // For creating a new client
      this.clientService.createClient(this.client).subscribe(
        (data) => {
          this.router.navigate(['/clients']);
        },
        (error) => {
          console.error('Error creating client', error);
        }
      );
    }
  }
}
