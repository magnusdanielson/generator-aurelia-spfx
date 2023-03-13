import {inject} from "aurelia";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { I<%= ClassName %>WebPartProps } from '../<%= ClassName %>WebPart';

@inject(Element, "WebPartContext","WebPartProperties")
export class <%= ClassName %>MyComponent
{
    constructor(private element:Element, private context:WebPartContext, private properties:I<%= ClassName %>WebPartProps )
    {
        // element.addEventListener('build', (theme) => { this.onThemeChange(theme); }, false);
        this._environmentMessage = this._getEnvironmentMessage();
        this.imageUrl = this._isDarkTheme ? require('./welcome-dark.png') : require('./welcome-light.png');
    }
    private _isDarkTheme: boolean = false;
    private _environmentMessage: string = '';
    public message = 'Hello World!';
    private imageUrl;

    private _getEnvironmentMessage(): string {
      if (!!this.context.sdks.microsoftTeams) { // running in Teams
        return this.context.isServedFromLocalhost ? "AppLocalEnvironmentTeams" : "AppTeamsTabEnvironment";
      }
  
      return this.context.isServedFromLocalhost ? "AppLocalEnvironmentSharePoint" : "AppSharePointEnvironment";
    }

}
