import { ExcludeBoth } from "../rules/exclude-both.ts";
import { ExcludeLower } from "../rules/exclude-lower.ts";
import { ExcludeUpper } from "../rules/exclude-upper.ts";
import { IncludeBoth } from "../rules/include-both.ts";
import { InfiniteRules } from "../rules/infinite-rules.ts";
import { Rules } from "../rules/rules.ts";
import { TOL } from "../tol.ts";

export class ContainmentConfig {
  private readonly rules: Rules;

  public readonly tol: number;

  public constructor(rules: Rules, tol = TOL) {
    this.rules = rules;
    this.tol = tol;
  }

  public static excludeStart(tol = TOL): ContainmentConfig {
    return new ContainmentConfig(ExcludeLower.makeRange(0, 1), tol);
  }

  public static excludeEnd(tol = TOL): ContainmentConfig {
    return new ContainmentConfig(ExcludeUpper.makeRange(0, 1), tol);
  }

  public static excludeBoth(tol = TOL): ContainmentConfig {
    return new ContainmentConfig(ExcludeBoth.makeRange(0, 1), tol);
  }

  public static includeBoth(tol = TOL): ContainmentConfig {
    return new ContainmentConfig(IncludeBoth.makeRange(0, 1), tol);
  }

  public static ray(tol = TOL): ContainmentConfig {
    return new ContainmentConfig(new InfiniteRules(), tol);
  }

  public shouldInclude(n: number): boolean {
    return this.rules.shouldInclude(n, this.tol);
  }
}
