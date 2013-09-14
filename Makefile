TARGET  = calculator

$(TARGET).min.js: $(TARGET).js
	uglifyjs $< --in-source-map $(TARGET).map --source-map $(TARGET).min.js.map --output $@

$(TARGET).js: $(TARGET).coffee
	coffee -cm $^

test: spec/calc_spec.coffee spec/utilities_spec.coffee
	coffee -c spec
	coffee -cbmj test/$(TARGET).js $(TARGET).coffee

push:
	git push origin gh-pages
