COMMENT
 Copying data into Production.BillOfMaterials

ERROR:  insert or update on table "billofmaterials" violates foreign key constraint "FK_BillOfMaterials_Product_ComponentID"
DETAIL:  Key (componentid)=(749) is not present in table "product".
 Copying data into Production.Culture

COPY 8
 Copying data into Production.Document

ERROR:  extra data after last expected column
CONTEXT:  COPY document, line 1: "	0	Documents	217	1	Documents		0    	0	2			27CF33AF-C338-4842-966C-75CA11AAA6A3	2017-12-13 13:58:03.9..."
 Copying data into Production.ProductCategory

COPY 4
 Copying data into Production.ProductSubcategory

COPY 37
 Copying data into Production.ProductModel

COPY 128
 Copying data into Production.Product

ERROR:  insert or update on table "product" violates foreign key constraint "FK_Product_UnitMeasure_WeightUnitMeasureCode"
DETAIL:  Key (weightunitmeasurecode)=(G  ) is not present in table "unitmeasure".
 Copying data into Production.ProductCostHistory

ERROR:  insert or update on table "productcosthistory" violates foreign key constraint "FK_ProductCostHistory_Product_ProductID"
DETAIL:  Key (productid)=(707) is not present in table "product".
 Copying data into Production.ProductDescription

COPY 762
 Copying data into Production.ProductDocument

ERROR:  invalid input syntax for type timestamp: "6AC0"
CONTEXT:  COPY productdocument, line 1, column modifieddate: "6AC0"
 Copying data into Production.Location

COPY 14
 Copying data into Production.ProductInventory

ERROR:  insert or update on table "productinventory" violates foreign key constraint "FK_ProductInventory_Product_ProductID"
DETAIL:  Key (productid)=(1) is not present in table "product".
 Copying data into Production.ProductListPriceHistory

ERROR:  insert or update on table "productlistpricehistory" violates foreign key constraint "FK_ProductListPriceHistory_Product_ProductID"
DETAIL:  Key (productid)=(707) is not present in table "product".
 Copying data into Production.Illustration

COPY 5
 Copying data into Production.ProductModelIllustration

COPY 7
 Copying data into Production.ProductModelProductDescriptionCulture

COPY 762
 Copying data into Production.ProductPhoto

COPY 101
 Copying data into Production.ProductProductPhoto

ERROR:  insert or update on table "productproductphoto" violates foreign key constraint "FK_ProductProductPhoto_Product_ProductID"
DETAIL:  Key (productid)=(1) is not present in table "product".
ERROR:  duplicate key value violates unique constraint "PK_ProductReview_ProductReviewID"
DETAIL:  Key (productreviewid)=(1) already exists.
 Copying data into Production.ScrapReason

COPY 16
 Copying data into Production.TransactionHistory

ERROR:  insert or update on table "transactionhistory" violates foreign key constraint "FK_TransactionHistory_Product_ProductID"
DETAIL:  Key (productid)=(784) is not present in table "product".
 Copying data into Production.TransactionHistoryArchive

COPY 89253
 Copying data into Production.UnitMeasure

COPY 38
 Copying data into Production.WorkOrder

ERROR:  extra data after last expected column
CONTEXT:  COPY workorder, line 1: "1	722	8	8	0	2011-06-03 00:00:00	2011-06-13 00:00:00	2011-06-14 00:00:00		2011-06-13 00:00:00"
 Copying data into Production.WorkOrderRouting

ERROR:  insert or update on table "workorderrouting" violates foreign key constraint "FK_WorkOrderRouting_WorkOrder_WorkOrderID"
DETAIL:  Key (workorderid)=(13) is not present in table "workorder".
ERROR:  column "stockedqty" of relation "workorder" does not exist
ERROR:  column "documentlevel" of relation "document" does not exist
ERROR:  column "documentnode" of relation "document" already exists
ERROR:  column "doc" does not exist
LINE 2:   SELECT rowguid, doc, get_byte(decode(substring(doc, 1, 2),...
                          ^
CREATE FUNCTION
ERROR:  column "doc" does not exist
LINE 4:     WHERE doc LIKE '01%'
                  ^
QUERY:  UPDATE Production.Document
   SET DocumentNode = DocumentNode || SUBSTRING(doc, 3,2)::bit(2)::INTEGER::VARCHAR || CASE SUBSTRING(doc, 5, 1) WHEN '0' THEN '.' ELSE '/' END,
     doc = SUBSTRING(doc, 6, 9999)
    WHERE doc LIKE '01%'
CONTEXT:  PL/pgSQL function f_convertdocnodes() line 8 at SQL statement
ERROR:  column "doc" of relation "document" does not exist
DROP FUNCTION
ERROR:  column "documentnode" of relation "productdocument" already exists
ALTER TABLE
ERROR:  column "doc" does not exist
LINE 2:   SELECT rowguid, doc, get_byte(decode(substring(doc, 1, 2),...
                          ^
CREATE FUNCTION
ERROR:  column "doc" does not exist
LINE 4:     WHERE doc LIKE '01%'
                  ^
QUERY:  UPDATE Production.ProductDocument
   SET DocumentNode = DocumentNode || SUBSTRING(doc, 3,2)::bit(2)::INTEGER::VARCHAR || CASE SUBSTRING(doc, 5, 1) WHEN '0' THEN '.' ELSE '/' END,
     doc = SUBSTRING(doc, 6, 9999)
    WHERE doc LIKE '01%'
CONTEXT:  PL/pgSQL function f_convertdocnodes() line 8 at SQL statement
ERROR:  column "doc" of relation "productdocument" does not exist
DROP FUNCTION
