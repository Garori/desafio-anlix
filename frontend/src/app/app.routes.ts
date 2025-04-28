import { Routes } from '@angular/router';
// import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { PatientComponent } from './pages/patient/patient.component';
import { IndicesComponent } from './pages/indices/indices.component';
import { ExportToCSVComponent } from './components/export-to-csv/export-to-csv.component';
import { ChartComponent } from './pages/chart/chart.component';

const routeConfig: Routes = [
    {
        path: '',
        component: SearchComponent,
        title: 'Search page',
    },
    {
        path: 'search',
        component: SearchComponent,
        title: 'Search page',
    },
    {
        path: 'patient/:id',
        component: PatientComponent,
        title: 'Paciente',
    },
    {
        path: 'indices',
        component: IndicesComponent,
        title: 'Indices',
    },
    {
        path: 'indices/:id',
        component: IndicesComponent,
        title: 'Indices Paciente',
    },
    {
        path: 'teste',
        component: ExportToCSVComponent,
        title: 'Indices Paciente',
    },
    {
        path: 'patient/:id/chart',
        component: ChartComponent,
        title: 'Histórico',
    },
    {
        path: '**',
        component: SearchComponent,
        title: 'Search page',
    }
]
export default routeConfig;

export const routes: Routes = [];
