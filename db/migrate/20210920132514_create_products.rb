# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[6.1]
  def change
    create_table :products do |t|
      t.text :slug, limit: 300
      t.text :name, limit: 300

      t.timestamps
    end
    add_index :products, :slug, unique: true, length: { slug: 300 }
    add_index :products, :name, unique: true, length: { name: 300 }
  end
end
