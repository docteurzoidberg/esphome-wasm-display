#pragma once

#include "color.h"
#include "millis.h"

namespace display {

    class DisplayBuffer {
        public:
        uint16_t _width = 0;
        uint16_t _height = 0;
        uint32_t * _buffer = nullptr;

        /// Fill the entire screen with the given color.
        void fill(Color color) {
          //TODO
        }

        /// Clear the entire screen by filling it with OFF pixels.
        void clear() {
          //TODO
        }

        /// Get the width of the image in pixels
        int get_width() {
          return _width;
        }

        /// Get the height of the image in pixels
        int get_height() {
          return _height;
        }

        void set_width(int width) {
          _width = width;
        }

        void set_height(int height) {
          _height = height;
        }

        void set_buffer(uint32_t * buffer) {
          _buffer = buffer;
        }

        /// return byte array
        uint32_t * get_buffer() {
          return _buffer;
          //return reinterpret_cast<uint32_t*>(_buffer.data());
        }

        /// Set a single pixel at the specified coordinates to the given color.
        void draw_pixel_at(int x, int y, Color color) {
          _buffer[y * _width + x] = color.raw_32;
        }
    };
}