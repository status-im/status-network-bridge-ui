{
  description = "Flake file for status network bridge website ";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-24.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSystem = nixpkgs.lib.genAttrs supportedSystems;
      pkgsFor = forEachSystem (system: import nixpkgs { inherit system; });
    in
    rec {
      formatter = forEachSystem (system: pkgsFor.${system}.nixpkgs-fmt);

      devShells = forEachSystem (system: {
        default = pkgsFor.${system}.mkShellNoCC {
          packages = with pkgsFor.${system}.buildPackages; [
            git
            openssh
            yarn-berry # yarn 4.2.2
            nodejs_20 # v20.15.1
            ghp-import # 2.1.0
          ];
        };
      });
    };
}
