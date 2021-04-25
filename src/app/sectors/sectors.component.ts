import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Sector } from '../sector';
import { SectorsService } from "../sectors.service";
import { MessageService } from "../message.service";

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {

  constructor(
    private sectorService: SectorsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getSectors();
  }

  sectors: Sector[] = [];
  preselectedSectors: Sector[] = [];
  sectorsForm = this.formBuilder.group({
    name: '',
    selected: [this.preselectedSectors],
    agreed: false
  });

  compareFn(c1: any, c2:any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  public handleError = (controlName: string, errorName: string) => {
    return this.sectorsForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    let ok = true;
    this.messageService.clear();
    if (this.sectorsForm.controls['name'].hasError('required')) {
      this.messageService.add('Name field is required!');
      ok = false;
    }
    if (this.sectorsForm.controls['agreed'].hasError('required')) {
      this.messageService.add('Agree to terms is required!');
      ok = false;
    }
    if (this.sectorsForm.controls['selected'].hasError('required')) {
      this.messageService.add('Sectors selection required!');
      ok = false;
    }
    if (ok) {
      // TODO: post
      alert(JSON.stringify(this.sectorsForm.value))
    }
  }

  getSectors(): void {
    this.sectorService.getSectors()
      .subscribe(sectors => this.flatSectors(sectors));
  }

  flatSectors(sectors: Sector[]): void {
    for (const item of sectors) {
      this.sectors.push(item);
      if (item.checked) {
        console.log(item.title);
        this.preselectedSectors.push(item);
      }
      if (item.childList.length > 0) {
        this.flatSectors(item.childList)
      }
    }
  }
}
