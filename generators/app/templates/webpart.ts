import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';
import Aurelia from 'aurelia';
import { DI, Registration } from 'aurelia';
import { <%= ClassName %>MyComponent } from './components/<%= KebabClassName %>my-component';
import styles from './<%= ClassName %>WebPart.module.scss';
import * as strings from '<%= ClassName %>WebPartStrings';

export interface I<%= ClassName %>WebPartProps {
  description: string;
}

export default class <%= ClassName %>WebPart extends BaseClientSideWebPart<I<%= ClassName %>WebPartProps> {

    private element;
    private tempTheme: IReadonlyTheme | undefined;

    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
      
      if (!currentTheme) {
        return;
      }
  
      this.tempTheme = currentTheme;
  
      if(typeof this.element !== "undefined")
      {
        const event = new CustomEvent('build', { detail: currentTheme });
        this.element.dispatchEvent(event);
      }
    }
  protected onInit(): Promise<void> {

    return super.onInit();
  }

  public async render() {
    // This line renders the html on the page
    this.domElement.innerHTML = `<<%= KebabClassName %>my-component class="${styles.<%= CamelClassName %>}"></<%= KebabClassName %>my-component>`;

    try {

      var au = new Aurelia();
      const rootContainer = au.container;
      rootContainer.register(
        Registration.instance("WebPartContext", this.context),
        Registration.instance("WebPartProperties", this.properties)
      );
      this.element = document.getElementsByClassName(styles.<%= CamelClassName %>)[0];

      await au.register(<any><%= ClassName %>MyComponent)
        .app({
          component: <%= ClassName %>MyComponent,
          host: this.element
        })
        .start();

        if(typeof this.tempTheme !== "undefined")
    {
      const event = new CustomEvent('build', { detail: this.tempTheme });
      this.element.dispatchEvent(event);
    }
    }
    catch (error) {
      console.log(error);
    }
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
