TARGET  = calculator

$(TARGET).min.js: $(TARGET).js
	uglifyjs $< --in-source-map $(TARGET).map --source-map $(TARGET).min.js.map --output $@

$(TARGET).js: $(TARGET).coffee
	coffee -cm $^

test:
	coffee -c spec

push:
	git push origin gh-pages
