import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { Sector } from '../model/sector';
import { SectorsService } from "../sectors.service";
import { MessageService } from "../message.service";
import { SectorsPageData } from "../model/sectorspagedata";

@Component({
  selector: 'app-sectors',
  templateUrl: './sectors.component.html',
  styleUrls: ['./sectors.component.css']
})
export class SectorsComponent implements OnInit {

  constructor(
    private sectorService: SectorsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getComponentData();
  }

  userName: string;
  sectors: Sector[] = [];
  agreed: boolean;
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
      this.saveSectorsByName();
    }
  }

  saveSectorsByName(): void {
    const pageData: SectorsPageData = {
      sectorList: this.sectorsForm.value.selected,
      agreed: this.sectorsForm.value.agreed,
      sysUserName: this.sectorsForm.value.name
    }
    this.sectorService.updateSectorsByName(pageData)
      .subscribe(pageData => this.extractPageData(pageData));
  }

  getComponentData(): void {
    this.sectorService.getSectorsPageData()
      .subscribe(pageData => this.extractPageData(pageData));
  }

  private extractPageData(pageData: SectorsPageData): void {
    this.flatSectors(pageData.sectorList);
    this.userName = pageData.sysUserName;
    this.agreed = pageData.agreed;
  }

  private flatSectors(sectors: Sector[]): void {
    for (const item of sectors) {
      this.sectors.push(item);
      if (item.checked) {
        this.preselectedSectors.push(item);
      }
      if (item.childList.length > 0) {
        this.flatSectors(item.childList)
      }
    }
  }
}
