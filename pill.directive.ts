import { Directive, HostBinding,Input, ElementRef } from '@angular/core';
import { Pill } from './pill';
import { has, isUndefined } from 'lodash';
import { 
    PillHostClass,
    PillStatusClass,
    PillStatus,
    PillIconClass,
    PillSize,
    PillFixedWidthClass,
    PillOutlineClass,
    PillBusyClass,
    PillComboParentClass,
    PillChildClass,
    PillChildFirstClass,
    PillMultipillParentClass
} from './pill.enum';

@Directive({
  selector: '[uiPill]'
})
export class PillDirective {

  private readonly hostClass: string = `${PillHostClass} ${PillStatusClass}`;
  private setBulkInputInProgress = false;

  private _className = '';
  private _status: PillStatus = PillStatus.DEFAULT;
  private _defaultIcon = '';
  private _size: PillSize = PillSize.DEFAULT;
  private _fixedWidth = '';
  private _outline = '';
  private _busy = '';
  private _comboParent = '';
  private _child = '';
  private _childFirst = '';
  private _multipillParent = '';

  group1 = [PillStatus.QUEUED, PillStatus.RUNNING, PillStatus.ABORTING];
  group2 = [PillStatus.QUEUED_INIT, PillStatus.QUEUED_LIMIT, PillStatus.RUNNING_INIT, PillStatus.RUNNING_LIMIT]; 

  @HostBinding('class')
  public hostClassName = this.hostClass;

  @Input()
  private set uiPill(val: Pill) {
      this.setPillInput(val);
      this.updateClassName();
  }

  set title(val) {
    if (val) {
      this.el.nativeElement.setAttribute('title', val);
      this.el.nativeElement.setAttribute('aria-label', val);
    } else {
        this.el.nativeElement.removeAttribute('title');
        this.el.nativeElement.removeAttribute('aria-label');
    }
  }

  set className(val) {
    this._className = val;
    if (!this.setBulkInputInProgress) {
        this.updateClassName();
    }
  }

  set status(val) {
    this._status = val;
    if(this.group1.includes(this._status)) {
      this.busy = true;
    }
    else if(this.group2.includes(this._status)) {
      this.busy = true;
      this.genericSetter('defaultIcon', true, PillIconClass);
    }
    
    if (!this.setBulkInputInProgress) {
      this.updateClassName();
    }
  }

  // set defaultIcon(val: boolean) {
  //   if(val) {
  //     this._defaultIcon = PillIconClass;
  //   }
  //   else {
  //     this._defaultIcon = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  set size(val) {
    this._size = val;
    if(!this.setBulkInputInProgress) {
      this.updateClassName();
    }
  }

  // set fixedWidth(val: boolean) {
  //   if(val) {
  //     this._fixedWidth = PillFixedWidthClass;
  //   }
  //   else {
  //     this._fixedWidth = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  // set outline(val: boolean) {
  //   if(val) {
  //     this._outline = PillOutlineClass;
  //   }
  //   else {
  //     this._outline = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  set busy(val: boolean) {
    if(val) {
      this._busy = PillBusyClass;
      this.el.nativeElement.setAttribute('aria-busy', 'true');
    }
    else {
      this._busy = '';
      this.el.nativeElement.removeAttribute('aria-busy');
    }
    if(!this.setBulkInputInProgress) {
      this.updateClassName();
    }
  }

  set disabled(val: boolean) {
    if (val) {
        this.el.nativeElement.setAttribute('aria-disabled', 'true');
    } else {
        this.el.nativeElement.removeAttribute('aria-disabled');
    }
  }

  // set comboParent(val: boolean) {
  //   if(val) {
  //     this._comboParent = PillComboParentClass;
  //   }
  //   else {
  //     this._comboParent = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  // set child(val: boolean) {
  //   if(val) {
  //     this._child = PillChildClass;
  //   }
  //   else {
  //     this._comboParent = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  // set childFirst(val: boolean) {
  //   if(val) {
  //     this._childFirst = PillChildFirstClass;
  //   }
  //   else {
  //     this._childFirst = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  // set multipillParent(val: boolean) {
  //   if(val) {
  //     this._multipillParent = PillMultipillParentClass;
  //   }
  //   else {
  //     this._multipillParent = '';
  //   }
  //   if(!this.setBulkInputInProgress) {
  //     this.updateClassName();
  //   }
  // }

  set task(val: boolean) {
    if(val) {
      this.size = PillSize.SMALL
    }
  }

  genericSetter(property, value, enumClass) {
    if(value) {
      this[`_${property}`] = enumClass;
    }
    else {
      this[`_${property}`] = '';
    }
    if(!this.setBulkInputInProgress) {
      this.updateClassName();
    }
  }


  constructor(private el: ElementRef) { }

  updateClassName() {
    this.hostClassName = `
        ${this.hostClass} ${this._className} ${this._status} ${this._defaultIcon} ${this._size} ${this._fixedWidth} ${this._outline} ${this._busy} ${this._comboParent} ${this._child} ${this._childFirst} ${this._multipillParent}
    `
    .replace(/  +/g, ' ')
    .trim();
  }


  setPillInput(fields: Pill) {
    this.setBulkInputInProgress = true;

    if(has(fields, 'task')) {
        this.task = fields.task; // if it's task, size should be PillSize.SMALL by default
    }

    if (has(fields, 'className')) {
      this.className = fields.className;
    }

    if (has(fields, 'status') && this.validatePillStatus(fields.status)) {
      this.status = PillStatus[fields.status.toUpperCase()];
      
      // if(this.group1.includes(this._status)) {
      //   this.busy = true;
      // }
      // else if(this.group2.includes(this._status)) {
      //   this.busy = true;
      //   // this.defaultIcon = true;
      //   this.genericSetter('defaultIcon', true, PillIconClass);
      // }
    }

    // if(has(fields, 'defaultIcon')) {
    //   this.defaultIcon = fields.defaultIcon;
    // }

    if(has(fields, 'defaultIcon')) {
      this.genericSetter('defaultIcon', fields.defaultIcon, PillIconClass)
    }

    if(has(fields, 'size') && this.validatePillSize(fields.size)) {
      this._size = PillSize[fields.size.toUpperCase()]
    }

    // if(has(fields, 'fixedWidth')) {
    //   this.fixedWidth = fields.fixedWidth;
    // }

    if(has(fields, 'fixedWidth')) {
      this.genericSetter('fixedWidth', fields.fixedWidth, PillFixedWidthClass)
    }

    // if(has(fields, 'outline')) {
    //   this.outline = fields.outline;
    // } 

    if(has(fields, 'outline')) {
      this.genericSetter('outline', fields.outline, PillOutlineClass)
    }

    if(has(fields, 'busy')) {
      this.busy = fields.busy;
    }

    if (has(fields, 'disabled')) {
      this.disabled = fields.disabled;
    }

    // if(has(fields, 'comboParent')) {
    //   this.comboParent = fields.comboParent;
    // }

    if(has(fields, 'comboParent')) {
      this.genericSetter('comboParent', fields.comboParent, PillComboParentClass)
    }

    // if(has(fields, 'child')) {
    //   this.child = fields.child;
    // }

    if(has(fields, 'child')) {
      this.genericSetter('child', fields.child, PillChildClass)
    }

    // if(has(fields, 'childFirst')) {
    //   this.childFirst = fields.childFirst;
    // }

    if(has(fields, 'childFirst')) {
      this.genericSetter('childFirst', fields.childFirst, PillChildFirstClass)
    }

    // if(has(fields, 'multipillParent')) {
    //   this.multipillParent = fields.multipillParent;
    // }

    if(has(fields, 'multipillParent')) {
      this.genericSetter('multipillParent', fields.multipillParent, PillMultipillParentClass)
    }

    if(has(fields, 'title')) {
      this.title = fields.title;
    }

    this.setBulkInputInProgress = false;
  }

  private validatePillStatus(val: string): boolean {
    if (isUndefined(PillStatus[val.toUpperCase()])) {
    }

    return !isUndefined(PillStatus[val.toUpperCase()]);
  }

  private validatePillSize(val: string): boolean {
    if(isUndefined(PillSize[val.toUpperCase()])) {
    }

    return !isUndefined(PillSize[val.toUpperCase()]);
  }

}
