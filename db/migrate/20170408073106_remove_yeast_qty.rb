class RemoveYeastQty < ActiveRecord::Migration[5.0]
  def change
    remove_column :yeasts, :quantity
  end
end
