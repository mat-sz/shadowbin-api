import dotenv from 'dotenv-flow';
import App from './App';
import ormconfig from '../ormconfig';

dotenv.config();
App(ormconfig);
