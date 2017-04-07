class RenameIngredientFk < ActiveRecord::Migration[5.0]
  def change
    rename_column :yeasts, :ingredient_id, :recipe_id
    rename_column :hops, :ingredient_id, :recipe_id
    rename_column :malts, :ingredient_id, :recipe_id
  end
end
