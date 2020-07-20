import { NgModule } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {
  Settings,
  Edit2,
  BarChart2,
  Command,
  Layers,
  Copy,
  LogOut,
  MoreHorizontal,
  AlignJustify,
  User,
  Trash2,
  Edit,
  Video,
  PhoneCall,
  Users,
  Plus,
  Twitch,
  List,
  PlusCircle,
} from 'angular-feather/icons';

const icons = {
  Settings,
  Edit2,
  BarChart2,
  Command,
  Layers,
  Copy,
  LogOut,
  MoreHorizontal,
  AlignJustify,
  User,
  Trash2,
  Edit,
  Video,
  PhoneCall,
  Users,
  Plus,
  Twitch,
  List,
  PlusCircle,
};

@NgModule({
  imports: [
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }