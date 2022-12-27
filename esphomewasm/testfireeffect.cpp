#include <emscripten/emscripten.h>

#include "testfireeffect.h"
#include "display_buffer.h"

DisplayFireEffect *testEffect = new DisplayFireEffect("fire");
display::DisplayBuffer *testBuffer = new display::DisplayBuffer();

extern "C" {

  EMSCRIPTEN_KEEPALIVE uint32_t * Init(uint32_t * buffer, int width, int height) {
    testBuffer->set_buffer(buffer);
    testBuffer->set_width(width);
    testBuffer->set_height(height);
    testEffect->init_internal(testBuffer);
    testEffect->set_width(width);
    testEffect->set_height(height);
    testEffect->set_speed(120);
    return testBuffer->get_buffer();
  }

  EMSCRIPTEN_KEEPALIVE void Loop() {
    testEffect->apply(*&*testBuffer);
  }

  EMSCRIPTEN_KEEPALIVE uint32_t * GetBuffer() {
    return testBuffer->get_buffer();
  }

}