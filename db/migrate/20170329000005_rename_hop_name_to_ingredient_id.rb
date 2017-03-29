class RenameHopNameToIngredientId < ActiveRecord::Migration[5.0]
  def change
      rename_column :hops, :name, :ingredient_id
      change_column :hops, :ingredient_id, :integer
  end
end
