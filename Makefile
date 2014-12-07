all: towns.topojson

townssurvey_shp.zip :
	curl -O http://wsgw.mass.gov/data/gispub/shape/state/townssurvey_shp.zip

towns.topojson : townssurvey_shp.zip
	unzip -o $^ -d shp
	ogr2ogr -t_srs EPSG:4326 shp/reprojected.shp shp/TOWNSSURVEY_POLY.shp 
	topojson --simplify-proportion 0.10 -p town=TOWN shp/reprojected.shp -o $@

clean:
	rm -rf shp/

clobber: clean
	rm -rf towns.topojson
