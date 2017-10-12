import {render} from 'react-dom';
import routes from './routes';

function boot({container}) {
  render(routes(), container);
}

boot({
  container: document.getElementById('root')
});
