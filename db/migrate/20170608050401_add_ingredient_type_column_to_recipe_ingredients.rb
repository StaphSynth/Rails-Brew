class AddIngredientTypeColumnToRecipeIngredients < ActiveRecord::Migration[5.0]
  def change
    add_column :recipe_ingredients, :ingredient_type, :string
  end
end
