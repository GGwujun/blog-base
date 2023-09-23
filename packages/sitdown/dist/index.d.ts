import Service from './service';
import * as Util from './util';
import { Options } from './types';
export declare class Sitdown {
    defaultOptions: Options;
    service: Service;
    constructor(options?: Options);
    HTMLToMD(html: string, env?: object): string;
    use(plugin: Plugin | Plugin[]): this;
}
export declare type Plugin = (service: Service) => void;
export { default as RootNode } from './service/RootNode';
export { Util };
