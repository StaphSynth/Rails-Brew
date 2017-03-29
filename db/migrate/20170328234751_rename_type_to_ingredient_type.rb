class RenameTypeToIngredientType < ActiveRecord::Migration[5.0]
  def change
    rename_column :ingredients, :type, :ingredient_type
  end
end
