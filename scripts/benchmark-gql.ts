// Configuration
const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql"; // Adjust this to your GraphQL endpoint
const ITERATIONS = 100;
const OUTPUT_FILE = "dataloader_benchmark_results.csv";

const DATA_LOADER_QUERY = `
query WithDataLoaders {
  categoriesDataLoaded {
    name
    products {
      name
      manufacturer {
        name
        id
      }
      stock {
        id
        quantity
      }
    }
  }
}`;

const NO_DATA_LOADER_QUERY = `
query WithDataLoaders {
  categories{
    name
    products {
      name
      manufacturer {
        name
        id
      }
      stock {
        id
        quantity
      }
    }
  }
}`;

interface BenchmarkResult {
  iteration: number;
  responseTimeMs: number;
}

async function runBenchmark(): Promise<void> {
  const results: BenchmarkResult[] = [];

  console.log(`Starting benchmark with ${ITERATIONS} iterations...`);

  for (let i = 1; i <= ITERATIONS; i++) {
    try {
      const startTime = performance.now();

      await fetch(GRAPHQL_ENDPOINT, {
        method: "post",
        body: JSON.stringify({ query: NO_DATA_LOADER_QUERY }),
        headers: { "Content-Type": "application/json" },
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        iteration: i,
        responseTimeMs: duration,
      });

      if (i % 10 === 0) {
        console.log(`Completed ${i} iterations`);
      }
    } catch (error) {
      console.error(`Error on iteration ${i}:`, error);
    }
  }

  const totalTimeMs = results.reduce((sum, r) => sum + r.responseTimeMs, 0);
  const avgTimeMs = totalTimeMs / results.length;
  const sortedTimes = [...results].sort(
    (a, b) => a.responseTimeMs - b.responseTimeMs,
  );
  const medianTimeMs =
    sortedTimes[Math.floor(results.length / 2)].responseTimeMs;
  const minTimeMs = sortedTimes[0].responseTimeMs;
  const maxTimeMs = sortedTimes[results.length - 1].responseTimeMs;

  // Print summary
  console.log("\nBenchmark Results:");
  console.log(`Total iterations: ${results.length}`);
  console.log(`Average response time: ${avgTimeMs.toFixed(2)} ms`);
  console.log(`Median response time: ${medianTimeMs.toFixed(2)} ms`);
  console.log(`Min response time: ${minTimeMs.toFixed(2)} ms`);
  console.log(`Max response time: ${maxTimeMs.toFixed(2)} ms`);
  console.log(`Results saved to ${OUTPUT_FILE}`);
}

runBenchmark().catch((error) => console.error("Benchmark error:", error));
