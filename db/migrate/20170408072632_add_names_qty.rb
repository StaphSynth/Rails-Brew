class AddNamesQty < ActiveRecord::Migration[5.0]
  def change
    add_column :malts, :name, :string
    add_column :malts, :quantity, :decimal
    add_column :hops, :name, :string
    add_column :hops, :quantity, :decimal
    add_column :yeasts, :name, :string
    add_column :yeasts, :quantity, :decimal
  end
end
