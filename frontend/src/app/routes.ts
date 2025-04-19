import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QueryPageComponent } from './query-page/query-page.component';

const routeConfig: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Home page',
    },
    {
        path: 'query',
        component: QueryPageComponent,
        title: 'Query page yay',
    },
];
export default routeConfig;