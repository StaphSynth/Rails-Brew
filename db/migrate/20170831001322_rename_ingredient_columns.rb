class RenameIngredientColumns < ActiveRecord::Migration[5.0]
  def change
    rename_column :recipe_malts, :malt, :handle
    rename_column :recipe_hops, :hop, :handle
    rename_column :recipe_yeasts, :yeast, :handle
    rename_column :recipe_adjuncts, :adjunct, :handle
  end
end
