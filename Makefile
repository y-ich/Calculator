TARGET  = calculator

$(TARGET).min.js: $(TARGET).js
	uglifyjs $< > $@

$(TARGET).js: $(TARGET).coffee
	coffee -c $(TARGET) $^

push:
	git push origin gh-pages
