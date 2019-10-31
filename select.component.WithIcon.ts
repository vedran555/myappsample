'[attr.aria-haspopup]': 'role',
'[attr.aria-expanded]': 'isOpen',
'[attr.aria-controls]': 'id + "-listbox"',
'[class.default-icon]': '!selectIcon',     /////////////// novo ///////////////////////
'(keydown)': '_onKeyDown($event)',
'(click)': '_onClick($event)',
'(blur)': '_onBlur($event)',

.
.
.

isOpen = false;

@Input()                    /////////////// novo ///////////////////////
selectIcon: string;        /////////////// novo ///////////////////////

@Input()
id = `ui-select-${ nextUniqueId++ }`;


