﻿using System;
using CSETWebCore.DataLayer.Model;

namespace CSETWebCore.Interfaces.Version
{
    public interface IVersionBusiness
    {
        CsetVersion GetVersionNumber();
    }
}

