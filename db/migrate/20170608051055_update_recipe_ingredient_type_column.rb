class UpdateRecipeIngredientTypeColumn < ActiveRecord::Migration[5.0]
  def change
    change_column :recipe_ingredients, :ingredient_type, :string, :null => false
  end
end
