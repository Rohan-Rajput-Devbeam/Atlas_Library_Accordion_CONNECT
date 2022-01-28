import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AtlasLibraryConnectWebPartStrings';
import AtlasLibraryConnect from './components/AtlasLibraryConnect';
import { IAtlasLibraryConnectProps } from './components/IAtlasLibraryConnectProps';

import { PropertyFieldPeoplePicker, PrincipalType } from '@pnp/spfx-property-controls/lib/PropertyFieldPeoplePicker';
import PnPTelemetry from "@pnp/telemetry-js";
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';

import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';

const telemetry = PnPTelemetry.getInstance();
telemetry.optOut();

export interface IAtlasLibraryConnectWebPartProps {
  people: any;
  description: string;
  authuser:boolean;
  color:any;
  gradientColor1: any;
  gradientColor2:any;

}

export default class AtlasLibraryConnectWebPart extends BaseClientSideWebPart<IAtlasLibraryConnectWebPartProps> {

  public render(): void {
    
    console.log(this.properties.people);
    const element: React.ReactElement<IAtlasLibraryConnectProps> = React.createElement(
      AtlasLibraryConnect,
      {
        description: this.properties.description,
        context: this.context,
        people:this.properties.people,
        gradientColor1:this.properties.gradientColor1,
        gradientColor2:this.properties.gradientColor2
        

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldPeoplePicker('people', {
                  label: 'People Picker',
                  initialData: this.properties.people,
                  allowDuplicate: false,
                  principalType: [PrincipalType.Users, PrincipalType.SharePoint, PrincipalType.Security],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context as any,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'peopleFieldId'

                }),
                PropertyFieldColorPicker('gradientColor1', {
                  label: 'Accordion Start Color',
                  selectedColor: this.properties.gradientColor1,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1500,
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: 'Precipitation',
                  key: 'colorFieldId'
                }),
                PropertyFieldColorPicker('gradientColor2', {
                  label: 'Accordion End Color',
                  selectedColor: this.properties.gradientColor2,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 1500, 
                  isHidden: false,
                  alphaSliderHidden: false,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: 'Precipitation',
                  key: 'colorFieldId'
                })
                
              ]
            }
          ]
        }
      ]
    };
  }
}
