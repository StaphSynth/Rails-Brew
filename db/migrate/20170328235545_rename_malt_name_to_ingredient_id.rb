class RenameMaltNameToIngredientId < ActiveRecord::Migration[5.0]
  def change
    rename_column :malts, :name, :ingredient_id
    change_column :malts, :ingredient_id, :integer
  end
end
