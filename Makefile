TARGET  = calculator

$(TARGET).min.js: $(TARGET).js
	uglifyjs $< --source-map "filename='$(TARGET).min.js.map'" --output $@

$(TARGET).js: $(TARGET).coffee
	coffee -cm $^

test: spec/calc_spec.coffee spec/utilities_spec.coffee
	coffee -c spec
	coffee -cbmj test/$(TARGET).js $(TARGET).coffee

push:
	git push origin gh-pages
