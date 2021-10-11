<!-- [![npm version](https://badge.fury.io/js/ngx-popover.svg)](https://badge.fury.io/js/ngx-popover) -->

# NgxNetwork

How many times you want from client to upload or download something
and you need to be sure his network is fast so with simplest
package every and updated continuously
with new features NgxNetwork you can do that.
let's finish the work 👷‍♂️👷‍♀️

## Installation

You can use either the npm command-line tool to install packages.

## NPM

> npm i ngx-network

# Usage ⁉

- import `NgxNetworkModule` module

```typescript
@NgModule({
  imports: [
   /* .... */
   NgxNetworkModule.forRoot(/* (Optional) Config 👇 */)
   /* .... */
  ],
})
```

- inject the service  `NgxNetworkService` into your class and using `start` function to network speed changing as PRO 😳


```typescript
export class AppComponent implements OnInit {
  constructor(private networkService: NgxNetworkService) {}
  ngOnInit() {
    this.networkService.getSpeed().subscribe((networkSpeedInfo) => {
      /* Do Your Amazing Stuff*/
    });

    /* OR */

     this.networkService.onSpeedChanged().subscribe((networkSpeedInfo) => {
      /* Do Your Amazing Stuff*/
    });
  }

}
```
--------------------------------------

## Configuration

you can change the tool configurations by define these attributes when import NgxNetworkModule

| Attribute   |   Required |   Type |                                                                                          Description | Default                            |
| ----------- | ---------: | -----: | ---------------------------------------------------------------------------------------------------: | ---------------------------------- |
| `url`       | (Optional) | string | url for image or file used for network speed measure you can change to another file from your assets | https://speed.hetzner.de/100MB.bin |
| `speedUnit` | (Optional) |  Units |                                                                the unit to measure the network speed | 'kb/s'                             |
| `delay`     | (Optional) | number |                                                                the unit to measure the network speed | 100                                |

Simplest and Easiest 👌💖👏

--------------------------------------
## API


`NgxNetworkService` Class

### Properties
| Function | Return | Description 
| ----------- | ---------: | -------- |
| `onSpeedChanged` | NetworkSpeedInfo | listen to speed changing and the request for testing speed will run forever until you cancel it  |
### Functions
| Function | Return | Description 
| ----------- | ---------: | -------- |
| `getSpeed` | NetworkSpeedInfo | get the current network speed |


--------------------------------------

`NetworkSpeedInfo` Interface
| Attribute | Type | Description |
| ----------- | ---------: | -------- |
| `speed` | number | url for image or file used for network speed measure you can change to another file from your assets |
| `unit` | Units | the unit to measure the network speed |

## Contribution

I welcome you to fork and add more features into it. If you have any bugs or feature request, please create an issue at [github repository](https://github.com/mahmoudshahin1111/ngx-network/issues).

## License

MIT
