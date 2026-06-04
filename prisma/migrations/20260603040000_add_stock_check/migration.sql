-- Add CHECK constraint to prevent negative stock
ALTER TABLE "Variante" ADD CONSTRAINT "stock_non_negative" CHECK (stock >= 0);
