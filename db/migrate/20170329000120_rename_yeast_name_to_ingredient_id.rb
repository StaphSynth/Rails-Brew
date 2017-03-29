class RenameYeastNameToIngredientId < ActiveRecord::Migration[5.0]
  def change
      rename_column :yeasts, :name, :ingredient_id
      change_column :yeasts, :ingredient_id, :integer
  end
end
