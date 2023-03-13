import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Aurelia, Registration } from 'aurelia';
import { <%= ClassName %>MyComponent } from './components/<%= KebabClassName %>my-component';

export interface I<%= ClassName %>WebPartProps {
  description: string;
}

export default class <%= ClassName %>WebPart extends BaseClientSideWebPart<I<%= ClassName %>WebPartProps> {


  protected onInit(): Promise<void> {
    return super.onInit();
  }

  public async render() {
    let id = this.instanceId;
    // This line renders the html on the page
    this.domElement.innerHTML = `<<%= KebabClassName %>my-component id="${id}"></<%= KebabClassName %>my-component>`;

    try {

      let id = this.instanceId;
      var au = new Aurelia();
      const rootContainer = au.container;
      rootContainer.register(
        Registration.instance("WebPartContext", this.context),
        Registration.instance("WebPartProperties", this.properties)
      );
     
      au.app({ host: document.getElementById(id), component: <%= ClassName %>MyComponent })
      .start();


    }
    catch (error) {
      console.log(error);
    }
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? "AppLocalEnvironmentTeams" : "AppTeamsTabEnvironment";
    }

    return this.context.isServedFromLocalhost ? "AppLocalEnvironmentSharePoint" : "AppSharePointEnvironment";
  }

  

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  
}
