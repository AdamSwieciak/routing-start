import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ServersService } from '../servers.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, CanComponentDeactivate {
  server: {id: number, name: string, status: string};
  serverName = '';
  serverStatus = '';
  allowEdit = false;
  changedSaved= false;

  constructor(private serversService: ServersService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: Params) => {
      this.allowEdit = params['allowEdit'] === '1' ? true : false ;
      }
    )
    const serverNumb=+this.route.snapshot.params['id']
    this.server = this.serversService.getServer(+serverNumb);
    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
 this.changedSaved=true;
 this.router.navigate(['../'], {relativeTo: this.route}) // cofnięcie do poprzedniej strony
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
if (!this.allowEdit) {
  return true
}
if (this.serverName !== this.server.name || this.serverStatus !== this.server.status && !this.changedSaved) {
  return confirm('Do you want to discard the changes?')
} else {
  return true
}
  }

}
