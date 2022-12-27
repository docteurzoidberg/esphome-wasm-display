#pragma once

#include <string>
#include "display_buffer.h"


 class DisplayEffect {
    public:
      explicit DisplayEffect( const std::string &name) : name_(name) {}
      const std::string &get_name() { return this->name_; }

      /// Initialize this LightEffect. Will be called once after creation.
      virtual void start() {}
      virtual void start_internal() { this->start(); }
      /// Called when this effect is about to be removed
      virtual void stop() {}
      /// Apply this effect. Use the provided state for starting transitions, ...
      virtual void apply(display::DisplayBuffer &it) = 0;
      /// Internal method called by the LightState when this light effect is registered in it.
      virtual void init() {}
      void init_internal(display::DisplayBuffer *display) {
        this->display_ = display;
        this->init();
      }
    protected:
      display::DisplayBuffer *get_display_() const { return (display::DisplayBuffer *) this->display_; }
      display::DisplayBuffer *display_{nullptr};
      std::string name_;
  };