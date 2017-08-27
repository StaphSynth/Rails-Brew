import ReactOnRails from 'react-on-rails';
import RecipeForm from '../components/RecipeForm';
import RecipeMetaPanel from '../components/RecipeMetaPanel';
import BrewCalc from '../lib/BrewCalcs'
import RecipeStyle from '../components/RecipeStyle';
import Ajax from '../lib/AjaxWrapper';
import Spinner from '../components/Spinner';
import Ingredient from '../components/Ingredient';
import Malt from '../components/Malt';
import VolumeAndEfficiency from '../components/VolumeAndEfficiency';
import IngredientList from '../components/IngredientList';
import Input from '../components/Input';
import Hop from '../components/Hop';
import Utils from '../lib/Utils';

ReactOnRails.register({
  RecipeForm,
});
