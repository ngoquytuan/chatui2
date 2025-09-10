"""
Standalone module to scan a directory structure and represent it as a structured JSON object.

Key features:
- Scans a directory recursively starting from a given path.
- Represents the structure with files and directories as distinct types.
- Excludes common non-essential directories for cleaner output.
- Self-contained with no external project dependencies.
- Validates output using bundled Pydantic schemas.
"""

# Standard library imports
import os
import json
import logging
from pathlib import Path
from typing import Set, Dict, Any, List, Optional, Literal

# Third-party imports
from pydantic import BaseModel, Field, ValidationError

# ---------------------------------------------------------------------------
# --- 1. CONFIGURATION (Integrated from asset_scanner.config) ---
# ---------------------------------------------------------------------------
class StandaloneSettings:
    """Application settings container for standalone execution."""
    LOG_LEVEL: int = logging.INFO
    DEFAULT_EXCLUDE_DIRS: Set[str] = {
        ".git", "__pycache__", ".vscode", ".idea", "venv", ".venv", "node_modules"
    }
    DEFAULT_OUTPUT_FILENAME: str = "directory_structure.json"

settings = StandaloneSettings()

# ---------------------------------------------------------------------------
# --- 2. PYDANTIC SCHEMAS (Integrated from asset_scanner.models.schema) ---
# ---------------------------------------------------------------------------

class FileSystemItem(BaseModel):
    """
    A recursive model representing an item in the file system (file or directory).
    """
    type: Literal["file", "directory"]
    name: str = Field(..., description="The name of the file or directory.")
    path: str = Field(..., description="The relative path from the scan root.")
    children: Optional[List["FileSystemItem"]] = Field(
        None, description="A list of child items if this item is a directory."
    )

# This is required for Pydantic to handle the recursive 'List["FileSystemItem"]'
FileSystemItem.model_rebuild()

class DirectoryScanResult(BaseModel):
    """
    The root schema for a directory scan result.
    """
    root_path: str = Field(..., description="The absolute path of the scanned root directory.")
    content: FileSystemItem = Field(..., description="The root item of the scanned structure.")


# ---------------------------------------------------------------------------
# --- 3. CORE SCANNER LOGIC ---
# ---------------------------------------------------------------------------

# Initialize logger for this module
logger = logging.getLogger(__name__)

class DirectoryScanner:
    """
    Scans a file system directory and creates a structured representation.

    This class is responsible for walking a directory tree from a specified
    root path and building a nested dictionary that conforms to the
    FileSystemItem schema. It is designed to be robust, with comprehensive
    error handling for file system permissions and other potential issues.

    Args:
        exclude_dirs (Optional[Set[str]]): A set of directory names to exclude
            from the scan. If None, uses the default from project settings.

    Attributes:
        exclude_dirs (Set[str]): The set of directory names to ignore during scanning.
    """

    def __init__(self, exclude_dirs: Optional[Set[str]] = None):
        """Initializes the DirectoryScanner with excluded directories."""
        try:
            self.exclude_dirs = exclude_dirs or settings.DEFAULT_EXCLUDE_DIRS
            logger.info(f"DirectoryScanner initialized. Excluding: {self.exclude_dirs}")
        except Exception as e:
            logger.error(f"Failed to initialize DirectoryScanner: {e}", exc_info=True)
            raise

    def scan(self, start_path: str) -> DirectoryScanResult:
        """
        Performs the directory scan and returns a validated data structure.

        This is the main public method to initiate a directory scan. It handles
        path validation, invokes the recursive scan, and validates the final
        output against the DirectoryScanResult schema.

        Args:
            start_path (str): The absolute or relative path to the directory to scan.

        Returns:
            DirectoryScanResult: A Pydantic model instance representing the
                complete and validated directory structure.

        Raises:
            FileNotFoundError: If the start_path does not exist or is not a directory.
            PermissionError: If the script lacks permissions to read the start_path.
            ValidationError: If the resulting structure fails Pydantic validation.
        """
        root_path = Path(start_path).resolve()
        logger.info(f"Starting directory scan at: {root_path}")

        if not root_path.is_dir():
            msg = f"Scan path '{start_path}' is not a valid directory."
            logger.error(msg)
            raise FileNotFoundError(msg)

        try:
            tree_root = self._build_tree_from_walk(root_path)
            scan_result_data = {
                "root_path": str(root_path),
                "content": tree_root
            }
            validated_result = DirectoryScanResult.model_validate(scan_result_data)
            logger.info(f"Successfully scanned and validated directory structure for '{root_path}'.")
            return validated_result

        except PermissionError as e:
            logger.error(f"Permission denied while scanning '{root_path}': {e}", exc_info=True)
            raise
        except ValidationError as e:
            logger.error(f"Output validation failed: {e}", exc_info=True)
            raise
        except Exception as e:
            logger.error(f"An unexpected error occurred during scan: {e}", exc_info=True)
            raise

    def _build_tree_from_walk(self, root_path: Path) -> Dict[str, Any]:
        """
        Builds a nested dictionary representation of the directory tree using os.walk.
        
        Args:
            root_path (Path): The Path object for the root directory.

        Returns:
            Dict[str, Any]: A dictionary conforming to the FileSystemItem structure.
        """
        dir_structure = {
            "type": "directory",
            "name": root_path.name,
            "path": ".",
            "children": []
        }
        
        dir_map = {str(root_path): dir_structure}

        for dirpath, dirnames, filenames in os.walk(str(root_path), topdown=True):
            dirnames[:] = [d for d in dirnames if d not in self.exclude_dirs]
            
            current_path = Path(dirpath)
            relative_path = current_path.relative_to(root_path)
            parent_node = dir_map[str(current_path)]

            for dirname in sorted(dirnames):
                dir_item = {
                    "type": "directory",
                    "name": dirname,
                    "path": str(relative_path.joinpath(dirname)),
                    "children": []
                }
                parent_node["children"].append(dir_item)
                dir_map[str(current_path.joinpath(dirname))] = dir_item

            for filename in sorted(filenames):
                file_item = {
                    "type": "file",
                    "name": filename,
                    "path": str(relative_path.joinpath(filename)),
                    "children": None
                }
                parent_node["children"].append(file_item)
                
        return dir_structure

# ---------------------------------------------------------------------------
# --- 4. SCRIPT EXECUTION BLOCK ---
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    # This block demonstrates how to run the scanner as a standalone script.

    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    logger.info("Running DirectoryScanner in standalone mode.")

    try:
        scanner = DirectoryScanner()
        scan_target_path = "."
        scan_result = scanner.scan(scan_target_path)
        output_json = scan_result.model_dump_json(indent=4)

        print("\n--- Directory Scan Result ---")
        print(output_json)
        print("---------------------------\n")

        output_filename = settings.DEFAULT_OUTPUT_FILENAME
        with open(output_filename, "w", encoding="utf-8") as f:
            f.write(output_json)
        
        logger.info(f"Scan result saved to '{output_filename}'")

    except (FileNotFoundError, PermissionError) as e:
        logger.error(f"A critical error occurred: {e}")
    except Exception as e:
        logger.error(f"An unexpected error stopped the script: {e}", exc_info=True)