import { Component, OnInit } from '@angular/core';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';



@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  loading = true;

  constructor(private clientService: ClientService, private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Clients | Car Rental');
    this.loadClients();
  }

  loadClients() {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
      },
      error: (err) => {
        alert('Failed to load clients');
        this.loading = false;
      },
    });
  }

  deleteClient(id: number) {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
      });
    }
  }

  editClient(id: number) {
    this.router.navigate(['/clients/edit', id]);
  }

  addClient() {
    this.router.navigate(['/clients/create']);
  }
}
