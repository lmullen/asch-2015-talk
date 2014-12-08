all: census.topojson

census.topojson : nhgis0035_csv.zip nhgis0035_shape.zip
	unzip -o nhgis0035_csv.zip -d census
	unzip -o nhgis0035_shape.zip -d census
	unzip -o census/nhgis0035_shape/nhgis0035_shapefile_tl2000_us_county_1850.zip \
		-d census
	ogr2ogr -t_srs EPSG:4326 census/counties.shp census/US_county_1850.shp
	topojson -o $@ --simplify-proportion 0.12 \
		--id-property GISJOIN \
		-e census/nhgis0035_csv/nhgis0035_ds10_1850_county.csv \
		-p cong=+AET003 -- \
		census/counties.shp

clean:
	rm -rf shp/
	rm -rf census/

clobber: clean
	rm -rf census.topojson
