#include <math.h>
#include <string>
#include "display_effect.h"

class DisplayFireEffect : public DisplayEffect {
    public:
      const char *TAG = "zilloscope.displayeffect";

      int max_flame_height = 1000;
      int max_heat_spots = 1000;
      int min_x_attenuation = 500;

      int min_flame_height = 300;
      int min_heat_spots = 300;
      int max_x_attenuation = 500;

      int init_flame_height = 1;
      int init_heat_spots = 1000;
      int init_x_attenuation = 5000;

      int speed = 15000;

      int starting_speed = 1000;

      int periodicity = 7200000;
      // pour constater la présence d'oscillations dans le feu, tu pourra diviser cette valeur par 1000 ou 1000000, ici 7200000 ça correspond a une période de 2h

      explicit DisplayFireEffect(const std::string &name) : DisplayEffect(name) {

      }

      int apow(int a, int b) {
        return 1000 + (a - 1000) * b / 1000;
      }

      int int_lerp(int a, int b, int c) {
        if(c <= 0)
          return a;
        if(c >= 1000)
          return b;
        return (a * (1000 - c) + b * c) / 1000;
      }

      unsigned int rnd(int x, int y) {
        int X = x ^ 64228;
        int Y = y ^ 61356;
        return ((
          X * 71521
          + Y * 13547
          ^ 35135) % 1000 + 1000) % 1000;
      }

      int noise(int X, int Y, int T, int flame_height, int heat_spots, int x_attenuation) {
        int x = X;
        int n = 0;

        int attenuation = (height_ - Y) * 1000 / height_ * 1000 / flame_height
          + (x_attenuation == 0 ? 0
          : std::max(0, apow(1000 - (X + 1) * (width_- X) * 4000 / ((width_ + 2) * (width_+ 2)), 1000000 / x_attenuation)));

        int sum_coeff = 0;

        for(int i = 8 ; i > 0 ; i >>= 1) {
          int y = Y + T * 8 / i;

          int rnd_00 = rnd(x / i, y / i);
          int rnd_01 = rnd(x / i, y / i + 1);
          int rnd_10 = rnd(x / i + 1, y / i);
          int rnd_11 = rnd(x / i + 1, y / i + 1);

          int coeff = i;

          int dx = x % i;
          int dy = y % i;

          n += ((rnd_00 * (i - dx) + rnd_10 * dx) * (i - dy)
              + (rnd_01 * (i - dx) + rnd_11 * dx) * dy)
            * coeff / (i * i);
          sum_coeff += coeff;
        }
        return std::max(0, apow(n / sum_coeff, 1000000 / heat_spots * 1000 / (attenuation + 1000)) - attenuation);
      }

      uint32_t heat_color(int heat) {
        int r = std::min(255, (int) (heat * 255 / 333));
        int g = std::min(255, std::max(0, (int) ((heat - 333) * 255 / 333)));
        int b = std::min(255, std::max(0, (int) ((heat - 667) * 255 / 333)));
        return (r << 16) | (g << 8) | b;
      }

      void start() override {

      }

      //each frame
      void apply(display::DisplayBuffer &it) override {
        unsigned long timer = millis();
        int begin_time = timer > starting_speed ? 1000 : (int) (timer * 1000 / starting_speed);

        // must be signed int
        int periodic_time = (int) (timer % periodicity);
        periodic_time = periodic_time * 1000 / periodicity;
        if(periodic_time > 500)
          periodic_time = 1000 - periodic_time;

        int flame_height = int_lerp(int_lerp(init_flame_height, max_flame_height, begin_time), min_flame_height, periodic_time);
        int heat_spots = int_lerp(int_lerp(init_heat_spots, max_heat_spots, begin_time), min_heat_spots, periodic_time);
        int x_attenuation = int_lerp(int_lerp(init_x_attenuation, min_x_attenuation, begin_time), max_x_attenuation, periodic_time);

        for(int x = 0 ; x < width_; x ++) {
          for(int y = 0 ; y < height_; y ++) {
            int heat = heat_color(noise(x, y, (int) (timer * speed_ / 1000), flame_height, heat_spots, x_attenuation));
            it.draw_pixel_at(x,y, Color(heat));
          }
        }
        //unsigned long timer2 = millis();
        //printf(TAG, "draw time: %lu" , (timer2-timer));
      }
      void set_speed(uint32_t speed) { this->speed_ = speed; }
      void set_width(uint16_t width) { this->width_ = width; }
      void set_height(uint16_t height) { this->height_ = height; }
    protected:
      uint32_t speed_{10};
      uint16_t width_{35};
      uint16_t height_{25};
  };
