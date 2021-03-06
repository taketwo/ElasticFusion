/*
 * This file is part of ElasticFusion.
 *
 * Copyright (C) 2015 Imperial College London
 *
 * The use of the code within this file and all code within files that
 * make up the software that is ElasticFusion is permitted for
 * non-commercial purposes only.  The full terms and conditions that
 * apply to the code within this file are detailed within the LICENSE.txt
 * file and at <http://www.imperial.ac.uk/dyson-robotics-lab/downloads/elastic-fusion/elastic-fusion-license/>
 * unless explicitly stated.  By downloading this file you agree to
 * comply with these terms.
 *
 * If you wish to use any of this code for commercial purposes then
 * please email researchcontracts.engineering@imperial.ac.uk.
 *
 */

#ifndef RAWLOGREADER_H_
#define RAWLOGREADER_H_

#include <memory>

#include <Utils/Resolution.h>
#include <Utils/Stopwatch.h>

#include "LogReader.h"

#include <iostream>
#include <stdio.h>
#include <string>

class RawLogReader : public LogReader
{
    public:
        RawLogReader(std::string file, bool flipColors);

        virtual ~RawLogReader();

        void getNext() override;

        void getBack() override;

        int getNumFrames() override;

        bool hasMore() override;

        bool rewound() override;

        void rewind() override;

        void fastForward(int frame) override;

        const std::string getFile() override;

        void setAuto(bool value) override;

        virtual void setExposureTime(float exposure_time) override;

        virtual void setGain(int gain) override;

        virtual float getExposureTime() override;

        virtual int getGain() override;

    private:
        void getCore();

        struct Impl;
        std::unique_ptr<Impl> p;
};

#endif /* RAWLOGREADER_H_ */
