let perms = {
  administrator: {
    perms: { read: true },
    subs: {
      positions: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      permissions: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      users: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      warehouseSettings: {
        perms: { read: true },
        subs: {
          warehouses: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          warehouseCategories: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          drugandFertilizers: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          mainIngredients: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          cropCategories: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          tools: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          plantProducts: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          plantProductSorts: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          reproductions: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          reserves: {
            perms: { read: true, create: true, update: true, delete: true },
          },
        },
      },
      landParcels: {
        perms: {
          read: true,
          create: true,
          update: true,
          delete: true,
          addSector: true,
          readSectors: true,
          updateSector: true,
          deleteSector: true,
          // new
          addCrop: true,
          readCrops: true,
          updateCrop: true,
          deleteCrop: true,
          ///////
        },
      },
      typesAndConditions: {
        perms: { read: true },
        subs: {
          paymentTerms: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          paymentKinds: {
            perms: { read: true, create: true, update: true, delete: true },
          },
          deliveryTerms: {
            perms: { read: true, create: true, update: true, delete: true },
          },
        },
      },
      clientAndConsumers: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      todos: {
        perms: { read: true, create: true, update: true, delete: true },
      },
    },
  },
  hr: {
    perms: { read: true },
    subs: {
      workers: {
        perms: {
          read: true,
          create: true,
          update: true,
          delete: true,
          //new
          readSalaryHistory: true,
          createSalaryHistory: true,
          /////
        },
      },
    },
  },
  warehouse: {
    perms: { read: true },
    subs: {
      demands: {
        // must add database
        perms: { create: true, read: true, readDemand: true },
      },
      purchases: {
        perms: { read: true },
        subs: {
          waiting: {
            perms: { read: true, update: true },
          },
          approved: {
            perms: { read: true, createPurchaseDocument: true },
          },
          preparing: {
            perms: { read: true },
          },
        },
      },
      purchasesOnWait: {
        perms: { read: true, addToReserves: true },
      },
      drugAndFertilizers: {
        perms: { read: true, import: true, export: true },
        subs: {
          reserves: { perms: { read: true, excelExport: true } },
          importAndExport: { perms: { read: true, excelExport: true } },
          tasks: { perms: { read: true } },
        },
      },
      productsWarehouse: {
        perms: { read: true, import: true, export: true, sale: true },
        subs: {
          products: {
            perms: { read: true, excelExport: true },
          },
          importExportAndDocs: {
            perms: { read: true, excelExport: true },
          },
        },
      },
      reservesWarehouse: {
        perms: { read: true, import: true, export: true },
        subs: {
          reserves: { perms: { read: true } },
          importExportAndDocs: { perms: { read: true } },
        },
      },
      history: {
        perms: { read: true },
      },
    },
  },
  workplan: {
    perms: { read: true },
    subs: {
      daily: {
        perms: { read: true, create: true, addTask: true },
        subs: {
          activeWorkPlans: {
            perms: { read: true },
          },
          doneWorkPlans: {
            perms: { read: true },
          },
        },
      },
      annual: {
        perms: { read: true, create: true, update: true },
      },
    },
  },
  financeAdminstrator: {
    perms: { read: true },
    subs: {
      operationTypes: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      paymentTypes: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      accountTypes: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      areaNames: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      customers: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      operationPoints: {
        perms: { read: true, create: true, update: true, delete: true },
      },
      sectors: {
        perms: { read: true, create: true, update: true, delete: true },
      },
    },
  },
  dailyFinancialReports: {
    perms: {
      read: true,
      create: true,
    },
  },
  weatherlink: {
    perms: {
      read: false,
    },
    subs: {
      keys: {
        perms :  {
          read: false,
          create: false,
          update: false,
          delete: false,
        }
      }
    }
  }
};

export const mapPermissions = (perms, backend) => {
  let newPerms = {};
  Object.keys(perms).forEach((key) => {
    newPerms[key] = {};
    if (backend[key]) {
      newPerms[key]["perms"] = {};
      Object.keys(perms[key]["perms"]).forEach((key2) => {
        newPerms[key]["perms"][key2] =
          backend[key]["perms"][key2] === undefined
            ? perms[key]["perms"][key2]
            : backend[key]["perms"][key2];
      });
      if (perms[key]["subs"]) {
        newPerms[key]["subs"] = mapPermissions(
          perms[key]["subs"],
          backend[key]["subs"]
        );
      }
    } else {
      newPerms[key] = perms[key];
    }
  });
  return newPerms;
};

export default perms;
